import { useState } from 'react';
import { storage } from '../utils/storage';
import { useModal } from '../hooks/useModal';
export default function ApiConfigModal({ onClose, onSave }: {
    onClose: () => void;
    onSave: () => void;
}) {
    const [key, setKey] = useState(storage.getApiKey());
    const ref = useModal(onClose);
    return <div className="modal-overlay active" onClick={e => { if (e.target === e.currentTarget)
        onClose(); }}><div className="modal-dialog api-config-dialog" ref={ref} role="dialog" aria-modal="true" aria-labelledby="api-title" tabIndex={-1}>
    <button className="modal-close-btn" aria-label="Close API settings" onClick={onClose}>×</button>
    <form onSubmit={e => { e.preventDefault(); storage.setApiKey(key); onSave(); }}><h2 id="api-title">Connect to TMDB</h2><p>Enter your TMDB v3 API key or Read Access Token to discover live movies. Leave it empty to use sample movies when no environment key is configured.</p><label htmlFor="api-key">API key or token</label><input id="api-key" className="search-input" type="password" autoComplete="off" value={key} onChange={e => setKey(e.target.value)}/><p>Your key is saved in this browser.</p><div className="modal-footer-actions"><button className="btn-primary" type="submit">Save configuration</button><button className="btn-secondary" type="button" onClick={onClose}>Cancel</button></div></form>
  </div></div>;
}
