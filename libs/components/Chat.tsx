import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { useReactiveVar } from '@apollo/client';

import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { socketVar, userVar } from '../../apollo/store';

import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member | null;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member | null;
	action: string;
}

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const textInput = useRef<HTMLInputElement>(null);

	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState<boolean>(false);
	const [openButton, setOpenButton] = useState<boolean>(false);

	const router = useRouter();

	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);

	/** LIFECYCLES **/

	useEffect(() => {
		if (!socket) return;

		socket.onmessage = (msg: MessageEvent) => {
			try {
				const data = JSON.parse(msg.data);

				console.log('WebSocket message:', data);

				switch (data.event) {
					case 'info': {
						const newInfo: InfoPayload = data;

						setOnlineUsers(newInfo.totalClients);

						break;
					}

					case 'getMessages': {
						const list: MessagePayload[] = data.list;

						setMessagesList(list);

						break;
					}

					case 'message': {
						const newMessage: MessagePayload = data;

						setMessagesList((prev) => [...prev, newMessage]);

						break;
					}

					default:
						break;
				}
			} catch (err) {
				console.log('WebSocket message error:', err);
			}
		};
	}, [socket]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);

		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	/** HANDLERS **/

	const handleOpenChat = () => {
		setOpen((prevState) => !prevState);
	};

	const getInputMessageHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const text = e.target.value;

		setMessageInput(text);
	}, []);

	const getKeyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
		try {
			if (e.key === 'Enter') {
				onClickHandler();
			}
		} catch (err) {
			console.log(err);
		}
	};

	const onClickHandler = () => {
		try {
			if (!messageInput.trim()) {
				sweetErrorAlert(Messages.error4);

				return;
			}

			if (!socket) {
				console.log('WebSocket mavjud emas');

				return;
			}

			if (socket.readyState !== WebSocket.OPEN) {
				console.log('WebSocket hali ochilmagan');

				return;
			}

			socket.send(
				JSON.stringify({
					event: 'message',
					data: messageInput,
				}),
			);

			setMessageInput('');
		} catch (err) {
			console.log('Message send error:', err);
		}
	};

	return (
		<Stack className="chatting">
			{/* CHAT BUTTON */}

			{openButton ? (
				<button className="chat-button" onClick={handleOpenChat}>
					{open ? <CloseFullscreenIcon /> : <MarkChatUnreadIcon />}
				</button>
			) : null}

			{/* CHAT FRAME */}

			<Stack className={`chat-frame ${open ? 'open' : ''}`}>
				{/* CHAT TOP */}

				<Box className={'chat-top'} component={'div'}>
					<div
						style={{
							fontFamily: 'Nunito',
						}}
					>
						Online Chat
					</div>

					<RippleBadge
						style={{
							margin: '-18px 0 0 21px',
						}}
						badgeContent={onlineUsers}
					/>
				</Box>

				{/* CHAT CONTENT */}

				<Box className={'chat-content'} id="chat-content" ref={chatContentRef} component={'div'}>
					<ScrollableFeed>
						<Stack className={'chat-main'}>
							{/* WELCOME MESSAGE */}

							<Box
								flexDirection={'row'}
								style={{
									display: 'flex',
								}}
								sx={{
									m: '10px 0px',
								}}
								component={'div'}
							>
								<div className={'welcome'}>Welcome to Live chat!</div>
							</Box>

							{/* MESSAGES */}

							{messagesList.map((ele: MessagePayload, index: number) => {
								const { text, memberData } = ele;

								const memberImage = memberData?.memberImage
									? `${REACT_APP_API_URL}/${memberData.memberImage}`
									: '/img/profile/defaultUser.svg';

								/*
								 * Agar message hozirgi
								 * userniki bo'lsa:
								 *
								 * RIGHT SIDE
								 */

								if (String(memberData?._id) === String(user?._id)) {
									return (
										<Box
											key={index}
											component={'div'}
											flexDirection={'row'}
											style={{
												display: 'flex',
											}}
											alignItems={'flex-end'}
											justifyContent={'flex-end'}
											sx={{
												m: '10px 0px',
											}}
										>
											<div className={'msg-right'}>{text}</div>
										</Box>
									);
								}

								/*
								 * Boshqa user yozgan bo'lsa:
								 *
								 * LEFT SIDE
								 */

								return (
									<Box
										key={index}
										component={'div'}
										flexDirection={'row'}
										style={{
											display: 'flex',
										}}
										sx={{
											m: '10px 0px',
										}}
									>
										<Avatar alt={memberData?.memberNick ?? 'Guest'} src={memberImage} />

										<div className={'msg-left'}>{text}</div>
									</Box>
								);
							})}
						</Stack>
					</ScrollableFeed>
				</Box>

				{/* CHAT INPUT */}

				<Box className={'chat-bott'} component={'div'}>
					<input
						ref={textInput}
						type={'text'}
						name={'message'}
						className={'msg-input'}
						placeholder={'Type message'}
						value={messageInput}
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
					/>

					<button className={'send-msg-btn'} onClick={onClickHandler}>
						<SendIcon
							style={{
								color: '#fff',
							}}
						/>
					</button>
				</Box>
			</Stack>
		</Stack>
	);
};

export default Chat;
