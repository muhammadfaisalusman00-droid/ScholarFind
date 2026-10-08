import { useEffect, useRef } from 'react';

type AdsterraSlotProps = {
  format: 'banner' | 'native';
  className?: string;
};

const NATIVE_SCRIPT_URL = 'https://pl31710102.profitableratecpmnetwork.com/72f12b24416945e0f316a50789bcea1b/invoke.js';
const NATIVE_CONTAINER_ID = 'container-72f12b24416945e0f316a50789bcea1b';
const BANNER_SCRIPT_URL = 'https://www.highrevenueformat.com/ae9828b7faa1af5dc7ecd5e399f3550c/invoke.js';

export function AdsterraSlot({ format, className = '' }: AdsterraSlotProps) {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;

    if (format === 'banner') {
      if (slot.querySelector(`script[src="${BANNER_SCRIPT_URL}"]`)) return;

      (window as Window & { atOptions?: Record<string, unknown> }).atOptions = {
        key: 'ae9828b7faa1af5dc7ecd5e399f3550c',
        format: 'iframe',
        height: 250,
        width: 300,
        params: {},
      };

      const script = document.createElement('script');
      script.src = BANNER_SCRIPT_URL;
      slot.appendChild(script);
      return;
    }

    if (slot.querySelector(`#${NATIVE_CONTAINER_ID}`)) return;

    const script = document.createElement('script');
    script.setAttribute('async', 'async');
    script.setAttribute('data-cfasync', 'false');
    script.src = NATIVE_SCRIPT_URL;

    const container = document.createElement('div');
    container.id = NATIVE_CONTAINER_ID;

    slot.append(script, container);
  }, [format]);

  return (
    <div className={className}>
      <div
        ref={slotRef}
        aria-label="Advertisement"
        style={format === 'banner' ? { width: 300, height: 250, marginLeft: 'auto', marginRight: 'auto' } : undefined}
      />
    </div>
  );
}