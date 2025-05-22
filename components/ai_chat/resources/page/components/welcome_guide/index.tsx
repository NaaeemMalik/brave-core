/* Copyright (c) 2023 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

import * as React from 'react'
import Button from '@brave/leo/react/button'
import { getLocale } from 'gen/brave/components/ai_chat/core/browser/locale'
import { useConversation } from '../../state/conversation_context'
import styles from './style.module.scss'

function WelcomeGuide() {
  const conversationContext = useConversation()

  const summarizeNow = () => {
    conversationContext.conversationHandler?.submitSummarizationRequest()
  }

  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <h1 className={styles.title}>{getLocale('welcomeGuideTitle')}</h1>
        <h2 className={styles.subtitle}>{getLocale('welcomeGuideSubtitle')}</h2>
      </div>
      <div className={`${styles.card} ${styles.siteHelpCard}`}>
        <h4 className={styles.cardTitle}>
          {getLocale('welcomeGuideSiteHelpCardTitle')}
        </h4>
        {conversationContext.associatedContentInfo &&
        conversationContext.shouldSendPageContents ? (
          <>
            <p>{getLocale('welcomeGuideSiteHelpCardWithAction')}</p>
            <div className={styles.actions}>
              <Button
                kind='outline'
                onClick={summarizeNow}
              >
                {getLocale('summarizeButtonLabel')}
              </Button>
            </div>
          </>
        ) : (
          <p>{getLocale('welcomeGuideSiteHelpCardDesc')}</p>
        )}
      </div>
      <div className={`${styles.card} ${styles.chatCard}`}>
        <h4 className={styles.cardTitle}>
          {getLocale('welcomeGuideChatCardTitle')}
        </h4>
        <p>{getLocale('welcomeGuideChatCardDesc')}</p>
      </div>
    </div>
  )
}

export default WelcomeGuide
