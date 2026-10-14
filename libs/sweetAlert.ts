import Swal from 'sweetalert2';
import 'animate.css';

export const sweetConfirmAlert = (msg: string) => {
	return new Promise(async (resolve) => {
		await Swal.fire({
			icon: 'question',
			text: msg,
			showClass: {
				popup: 'animate__bounceIn',
			},
			showCancelButton: true,
			showConfirmButton: true,
			confirmButtonColor: '#e92C28',
			cancelButtonColor: '#bdbdbd',
		}).then((response) => {
			if (response?.isConfirmed) resolve(true);
			else resolve(false);
		});
	});
};

export const sweetErrorAlert = async (msg: string, duration: number = 3000) => {
	await Swal.fire({
		icon: 'error',
		title: msg,
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetMixinSuccessAlert = async (msg: string, duration: number = 2000) => {
	await Swal.fire({
		icon: 'success',
		title: msg,
		showConfirmButton: false,
		timer: duration,
	});
};
