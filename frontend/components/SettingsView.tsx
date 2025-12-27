import React, { useState } from 'react';

interface SettingsViewProps {
    user: { name: string; role: string; email: string } | null;
    onUpdateUser: (name: string, email: string) => void;
    onBack: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdateUser, onBack }) => {
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            onUpdateUser(name, email);
            setIsSaving(false);
            onBack();
        }, 800);
    };

    return (
        <div className="settings-view">
            <div className="settings-card">
                <div className="settings-card__header">
                    <h2 className="settings-card__title">Profile Settings</h2>
                    <p className="settings-card__subtitle">Update your personal information and how others see you.</p>
                </div>

                <form onSubmit={handleSubmit} className="settings-form">
                    <div className="settings-form__group">
                        <label className="settings-form__label">Full Name</label>
                        <input
                            type="text"
                            className="settings-form__input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                        />
                    </div>

                    <div className="settings-form__group">
                        <label className="settings-form__label">Email Address</label>
                        <input
                            type="email"
                            className="settings-form__input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="settings-form__actions">
                        <button type="button" className="btn-secondary" onClick={onBack}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsView;
