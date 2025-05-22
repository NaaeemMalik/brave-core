/* Copyright (c) 2023 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as React from 'react'
import Alert from '@brave/leo/react/alert'
import Button from '@brave/leo/react/button'
import { getLocale } from 'gen/brave/components/ai_chat/core/browser/locale'
import styles from './alerts.module.scss'
import { useActiveChat } from '../../state/active_chat_context'

function ErrorConversationEnd() {
  const { createNewConversation } = useActiveChat()

  return (
    <div className={styles.alert}>
      <Alert
        type='error'
      >
        {getLocale('conversationEndError')}
        <Button
          slot='actions'
          kind='plain-faint'
          onClick={createNewConversation}
        >
          {getLocale('menuNewChat')}
        </Button>
      </Alert>
    </div>
  )
}

export default ErrorConversationEnd
