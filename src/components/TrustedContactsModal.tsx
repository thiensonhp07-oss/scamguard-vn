import React, { useState } from 'react';
import {
  Users,
  X,
  Lock,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Key,
  PhoneCall,
} from 'lucide-react';
import { TrustedContact } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface TrustedContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: TrustedContact[];
  onSaveContacts: (contacts: TrustedContact[]) => void;
}

export const TrustedContactsModal: React.FC<TrustedContactsModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onSaveContacts,
}) => {
  const { t } = useTranslation();
  const [safeWord, setSafeWord] = useState('HOA-SEN-VANG-2026');
  const [isEditingSafeWord, setIsEditingSafeWord] = useState(false);
  const [tempSafeWord, setTempSafeWord] = useState(safeWord);

  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('Con Gái');

  if (!isOpen) return null;

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const newContact: TrustedContact = {
      id: `tc-${Date.now()}`,
      name: newName,
      relationship: newRole,
      phoneOrHandle: newPhone,
      isFavorite: true,
    };

    onSaveContacts([...contacts, newContact]);
    setNewName('');
    setNewPhone('');
  };

  const handleDeleteContact = (id: string) => {
    onSaveContacts(contacts.filter((c) => c.id !== id));
  };

  const handleSaveSafeWord = () => {
    setSafeWord(tempSafeWord);
    setIsEditingSafeWord(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 p-6 border-b border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{t('tc_title')}</h3>
              <p className="text-xs text-purple-300">{t('tc_subtitle')}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Family Safe-Word Section */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-1.5">
                <Key className="w-4 h-4" />
                <span>{t('tc_safeword_title')}</span>
              </span>

              {!isEditingSafeWord ? (
                <button
                  onClick={() => {
                    setTempSafeWord(safeWord);
                    setIsEditingSafeWord(true);
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 font-bold hover:underline"
                >
                  {t('tc_safeword_btn_change')}
                </button>
              ) : (
                <button
                  onClick={handleSaveSafeWord}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
                >
                  {t('tc_safeword_btn_save')}
                </button>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{t('tc_safeword_desc')}</p>

            {isEditingSafeWord ? (
              <input
                type="text"
                value={tempSafeWord}
                onChange={(e) => setTempSafeWord(e.target.value)}
                className="w-full bg-slate-900 border border-purple-500 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white focus:outline-none"
              />
            ) : (
              <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/30 text-center">
                <span className="text-lg font-black font-mono tracking-widest text-purple-300">
                  {safeWord}
                </span>
              </div>
            )}
          </div>

          {/* Trusted Contacts List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('tc_list_title')} ({contacts.length})
            </h4>

            {contacts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                {t('tc_empty')}
              </div>
            ) : (
              <div className="space-y-2">
                {contacts.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">{c.name}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/20 text-purple-300">
                          {c.relationship}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{c.phoneOrHandle}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteContact(c.id)}
                      className="text-slate-500 hover:text-rose-400 p-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Contact Form */}
          <form onSubmit={handleAddContact} className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {t('tc_form_title')}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Họ tên (VD: Con Gái Mai)"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-purple-500"
              />

              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Số điện thoại / Zalo"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-purple-500"
              />

              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:ring-1 focus:ring-purple-500"
              >
                <option value="Con Cái">Con Cái</option>
                <option value="Cha Mẹ / Ông Bà">Cha Mẹ / Ông Bà</option>
                <option value="Vợ / Chồng">Vợ / Chồng</option>
                <option value="Chuyên Viên Ngân Hàng">Chuyên Viên Ngân Hàng</option>
                <option value="Luật Sư / Bạn Thân">Luật Sư / Bạn Thân</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!newName.trim() || !newPhone.trim()}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 disabled:opacity-50 transition-colors flex items-center justify-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t('tc_btn_save')}</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
