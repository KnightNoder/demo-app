import React, { useRef, useEffect } from "react";
import Icons from "../../../assets/Icons/Icons";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-20 flex items-center justify-center bg-transparent bg-opacity-50 modal backdrop-blur-sm">
			<div
				ref={modalRef}
				className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-[80%] h-[80%] flex flex-col"
			>
				<div className="flex items-center justify-between pb-2 pr-10">
					<span className="font-semibold">{title}</span>
					<div className="flex items-center gap-4">
						<button onClick={onClose}>
							<Icons variant="close" />
						</button>
					</div>
				</div>
				<div className="relative flex-1 p-4 overflow-y-auto">
					{children}
				</div>
				{footer && <div className="pt-2 border-t">{footer}</div>}
			</div>
		</div>
	);
};

export default Modal;
