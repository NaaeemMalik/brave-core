/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_BROWSER_UI_SIDEBAR_SIDEBAR_SERVICE_FACTORY_H_
#define BRAVE_BROWSER_UI_SIDEBAR_SIDEBAR_SERVICE_FACTORY_H_

#include <memory>
#include <vector>

#include "brave/components/sidebar/browser/sidebar_item.h"
#include "components/keyed_service/content/browser_context_keyed_service_factory.h"
#include "components/keyed_service/core/keyed_service.h"

class Profile;

namespace base {
template <typename T>
class NoDestructor;
}  // namespace base

namespace sidebar {

class SidebarService;

class SidebarServiceFactory : public BrowserContextKeyedServiceFactory {
 public:
  static SidebarServiceFactory* GetInstance();
  static SidebarService* GetForProfile(Profile* profile);

 private:
  friend base::NoDestructor<SidebarServiceFactory>;
  friend class SidebarBrowserTest;

  // This is the default display order
  static constexpr SidebarItem::BuiltInItemType kDefaultBuiltInItemTypes[] = {
      SidebarItem::BuiltInItemType::kChatUI,
      SidebarItem::BuiltInItemType::kFacebook,     // Added Facebook in a prominent position
      SidebarItem::BuiltInItemType::kWallet,
      SidebarItem::BuiltInItemType::kBookmarks,
      SidebarItem::BuiltInItemType::kReadingList,
      SidebarItem::BuiltInItemType::kHistory,
      SidebarItem::BuiltInItemType::kPlaylist,
      SidebarItem::BuiltInItemType::kBraveTalk      // Kept in master list for static_assert, will be filtered out
  };
  // The static_assert should now pass: std::size is 8, kBuiltInItemLast is kFacebook (value 8).
  static_assert(
      std::size(kDefaultBuiltInItemTypes) ==
          static_cast<size_t>(SidebarItem::BuiltInItemType::kBuiltInItemLast),
      "kDefaultBuiltInItemTypes must list all items up to kBuiltInItemLast if the assertion is to hold.");

  SidebarServiceFactory();
  ~SidebarServiceFactory() override;

  SidebarServiceFactory(const SidebarServiceFactory&) = delete;
  SidebarServiceFactory& operator=(const SidebarServiceFactory&) = delete;

  std::vector<SidebarItem::BuiltInItemType> GetBuiltInItemTypesForProfile(
      Profile* profile) const;

  // BrowserContextKeyedServiceFactory overrides:
  std::unique_ptr<KeyedService> BuildServiceInstanceForBrowserContext(
      content::BrowserContext* context) const override;
  content::BrowserContext* GetBrowserContextToUse(
      content::BrowserContext* context) const override;
  void RegisterProfilePrefs(
      user_prefs::PrefRegistrySyncable* registry) override;
};

}  // namespace sidebar

#endif  // BRAVE_BROWSER_UI_SIDEBAR_SIDEBAR_SERVICE_FACTORY_H_
