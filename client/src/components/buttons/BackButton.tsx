import { ChevronLeft } from 'lucide-react';

type BackButtonProps = {
	size?: number;
};

export default function BackButton({ size = 8 }: BackButtonProps) {
	return (
		<button onClick={() => window.history.back()}>
			<ChevronLeft className={`h-${size} w-${size}`} />
		</button>
	);
}
