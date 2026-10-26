import { useEffect, useRef } from 'react';
export function useModal(onClose: () => void) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const previous = document.activeElement as HTMLElement | null;
        const overflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const dialog = ref.current;
        dialog?.focus();
        function keydown(event: KeyboardEvent) {
            if (event.key === 'Escape')
                onClose();
            if (event.key !== 'Tab' || !dialog)
                return;
            const elements = Array.from(dialog.querySelectorAll<HTMLElement>('button, a[href], input, select, [tabindex="0"]'));
            const first = elements[0];
            const last = elements[elements.length - 1];
            if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
                event.preventDefault();
                last?.focus();
            }
            else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) {
                event.preventDefault();
                first?.focus();
            }
        }
        document.addEventListener('keydown', keydown);
        return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keydown); previous?.focus(); };
    }, [onClose]);
    return ref;
}
