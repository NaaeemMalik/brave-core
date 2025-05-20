#!/usr/bin/env python3

import argparse
import os
import sys
import re

JS_LOCALE_FILE = 'locale.ts'
CPP_LOCALIZED_STRINGS_FILE = 'localized_strings'

string_regex = 'name="(IDS_[A-Z0-9_]+)"'


root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
def get_include_path(path):
    return os.path.relpath(path, root)

def get_string_ids(grdp_file):
    string_ids = []
    with open(grdp_file, 'r') as f:
        for line in f:
            match = re.search(string_regex, line)
            if match:
                yield match.group(1)

def get_string_mapping(args):
    mapping = {}

    for string_id in get_string_ids(args.input_grdp):
        # Strip the IDS_ prefix
        stripped_string_id = string_id[4:]

        for prefix in args.strip_string_prefixes:
          if stripped_string_id.startswith(prefix):
            stripped_string_id = stripped_string_id[len(prefix):]
          if stripped_string_id.startswith('_'):
            stripped_string_id = stripped_string_id[1:]

        jsName=[x[0].upper() + x[1:] for x in stripped_string_id.lower().split('_')]
        jsName[0] = jsName[0].lower()
        mapping[string_id] = ''.join(jsName)

    return mapping

def parse_args():
    parser = argparse.ArgumentParser(description='Generate WebUI strings from a resources file')
    parser.add_argument('--input_grdp', type=str)
    parser.add_argument('--generate_js', action='store_true')
    parser.add_argument('--generate_localized_strings', action='store_true')
    parser.add_argument('--target_gen_dir', type=str)
    parser.add_argument('--cpp_namespace', type=str)
    parser.add_argument('--string_include_path', type=str)
    parser.add_argument('--strip_string_prefixes', type=str, nargs='*')
    args = parser.parse_args()

    return args

def generate_js(mapping, args):
    string_keys = "\n  | ".join([f'"{k}"' for k in mapping.values()])
    type_def = f"""
import {{ getLocale as getLocaleInternal, formatLocale as formatLocaleInternal, Replacement, Options, ReturnType }} from '$web-common/locale';
export type StringKey = {string_keys}

export function getLocale(key: StringKey): string {{
  return getLocaleInternal(key);
}}

export function formatLocale<T extends Replacement>(key: StringKey, replacements: Record<`$${{string}}`, T>, options?: Options): ReturnType<T> {{
  return formatLocaleInternal(key, replacements, options);
}}
"""

    with open(os.path.join(args.target_gen_dir, JS_LOCALE_FILE), 'w') as f:
      f.write(type_def)

def generate_localized_strings(mapping, args):
    header = f"""
#include "base/containers/span.h"
#include "ui/base/webui/web_ui_util.h"

namespace {args.cpp_namespace} {{
  base::span<const webui::LocalizedString> GetLocalizedStrings();
}}
"""
    header_path = os.path.join(args.target_gen_dir, CPP_LOCALIZED_STRINGS_FILE + '.h')

    with open(header_path, 'w') as f:
      f.write(header)

    localized_strings = ',\n          '.join([f'{{"{v}", {k}}}' for k, v in mapping.items()])
    definition = f"""
#include "{get_include_path(header_path)}"

#include "{args.string_include_path}"

namespace {args.cpp_namespace} {{
  base::span<const webui::LocalizedString> GetLocalizedStrings() {{
    static constexpr auto kLocalizedStrings = std::to_array<
      webui::LocalizedString>(
        {{{localized_strings}}});
    return kLocalizedStrings;
  }}
}}"""
    with open(os.path.join(args.target_gen_dir, CPP_LOCALIZED_STRINGS_FILE + '.cc'), 'w') as f:
      f.write(definition)

def main():
  args = parse_args()
  if not os.path.exists(args.target_gen_dir):
    os.makedirs(args.target_gen_dir)

  mapping = get_string_mapping(args)

  if args.generate_js:
    generate_js(mapping, args)

  if args.generate_localized_strings:
    generate_localized_strings(mapping, args)

if __name__ == '__main__':
    main()
