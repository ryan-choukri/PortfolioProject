'use client';
import React, { useState } from 'react';
import { TextScramble } from '@/components/ui/text-scramble';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    setStatus('idle');
    setLoading(true);

    try {
      console.log('Form data to be sent:', formData);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col p-6 sm:px-6 lg:px-8">
      {/* Header */}
      <h1 className="mb-2 text-center text-4xl font-bold sm:text-6xl">
        <TextScramble text="Contact" className="text-white" />
      </h1>
      <p className="mb-8 text-center text-gray-300">N&apos;hésitez pas à me contacter pour discuter de projets ou opportunités</p>

      {/* Contact Form */}
      <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-white">
              Nom complet *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/20 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
              placeholder="Votre nom et prénom"
              disabled={loading}
            />
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Adresse e-mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-white/20 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
              placeholder="votre.email@exemple.com"
              disabled={loading}
            />
          </div>

          {/* Message Textarea */}
          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium text-white">
              Votre message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              className="w-full resize-none rounded-lg border border-white/20 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:outline-none"
              placeholder="Décrivez votre projet, vos besoins ou vos questions..."
              disabled={loading}
            />
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-4 text-center">
              <p className="text-green-400">✨ Message envoyé avec succès ! Je vous répondrai bientôt.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-center">
              <p className="text-red-400">❌ Erreur lors de l&apos;envoi. Veuillez réessayer plus tard.</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Envoi en cours...
              </span>
            ) : (
              'Envoyer le message'
            )}
          </button>
        </form>

        {/* Contact Info */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-gray-800/50 p-6 text-center backdrop-blur-sm">
            <div className="mb-2 text-2xl">📧</div>
            <h3 className="mb-2 text-lg font-semibold text-white">Email</h3>
            <p className="text-gray-300">Réponse sous 24h</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-gray-800/50 p-6 text-center backdrop-blur-sm">
            <div className="mb-2 text-2xl">⚡</div>
            <h3 className="mb-2 text-lg font-semibold text-white">Réactivité</h3>
            <p className="text-gray-300">Disponible pour projets</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 rounded-lg border border-white/10 bg-gray-900/50 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-lg font-semibold text-white">💡 Projets qui m&apos;intéressent</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-gray-300">• Applications web interactives</p>
              <p className="text-sm text-gray-300">• Développement React/Next.js</p>
              <p className="text-sm text-gray-300">• Interfaces utilisateur modernes</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">• Optimisation de performances</p>
              <p className="text-sm text-gray-300">• Intégrations API complexes</p>
              <p className="text-sm text-gray-300">• Projets créatifs et innovants</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
