/* Copyright (c) 2023 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as React from 'react'
import Alert from '@brave/leo/react/alert'
import Button from '@brave/leo/react/button'
import styles from './alerts.module.scss'

import { getLocale } from 'gen/brave/components/ai_chat/core/browser/locale'

interface PromptAutoSuggestionProps {
  onRetry?: () => void
}

function ErrorConnection (props: PromptAutoSuggestionProps) {
  return (
    <div className={styles.alert}>
      <Alert
        type='error'
      >
        {getLocale('errorNetwork')}
        <Button
          slot='actions'
          kind='filled'
          onClick={props.onRetry}
        >
            {getLocale('retryButtonLabel')}
        </Button>
      </Alert>
    </div>
  )
}

export default ErrorConnection
