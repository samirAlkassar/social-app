import { useState } from 'react';
import {Palette, Shield, Bell, Eye, Moon, Sun, Monitor } from 'lucide-react';

export const SettingsPanel = () => {
    const [theme, setTheme] = useState('light');
    const [privacy, setPrivacy] = useState('public');
    const [notifications, setNotifications] = useState({likes: true, comments: true, follows: true, messages: false});

    return (
        <div className="space-y-6">
            {/* Theme Settings */}
            <div className="bg-secondary border border-border rounded-xl p-4">
                <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Theme Settings
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-text">Appearance</span>
                        <div className="flex gap-2">
                            {[
                                { value: 'light', icon: Sun, label: 'Light' },
                                { value: 'dark', icon: Moon, label: 'Dark' },
                                { value: 'auto', icon: Monitor, label: 'Auto' }
                            ].map(({ value, icon: Icon, label }) => (
                                <button
                                    key={value}
                                    onClick={() => setTheme(value)}
                                    className={`p-2 rounded-lg transition-colors ${theme === value
                                            ? 'bg-card text-text'
                                            : 'bg-secondary text-text hover:bg-secondary'
                                        }`}
                                    title={label}
                                >
                                    <Icon className="w-4 h-4" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-secondary border border-border rounded-xl p-4">
                <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy Settings
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-text">Profile Visibility</span>
                        <select
                            value={privacy}
                            onChange={(e) => setPrivacy(e.target.value)}
                            className="px-3 py-2 border border-border cursor-pointer rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-neutral-400">
                            <option value="public">Public</option>
                            <option value="friends">Friends Only</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-text">Show Online Status</span>
                        <button className="p-2 rounded-lg bg-secondary hover:bg-secondary transition-colors">
                            <Eye className="w-4 h-4 text-text" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-secondary border border-border rounded-xl p-4">
                <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                </h3>
                <div className="space-y-3">
                    {Object.entries(notifications).map(([key, enabled]) => (
                        <div key={key} className="flex items-center justify-between">
                            <span className="text-text capitalize">{key}</span>
                            <button
                                onClick={() => setNotifications(prev => ({ ...prev, [key]: !enabled }))}
                                className={`w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-text/40' : 'bg-text/40'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full transition-transform ${enabled ? 'translate-x-6 bg-primary' : 'translate-x-1 bg-text'
                                    }`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

};