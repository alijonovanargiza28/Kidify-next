import React from 'react';
import styles from './Chat.module.scss';
import { useRouter } from 'next/router';
import { chatText } from '../chat/translations';
export default function Chat() {
	const router = useRouter(),
		t = chatText(router.locale);
	return (
		<button
			type="button"
			className={styles.openChat}
			onClick={() =>
				window.dispatchEvent(new CustomEvent('kidify:open-chat', { detail: { peerId: router.query.peerId } }))
			}
		>
			{t.open}
		</button>
	);
}
