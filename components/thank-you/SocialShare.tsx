'use client';

import { motion } from 'framer-motion';
import { Share2, Copy, Check } from 'lucide-react';
import { FaWhatsapp, FaFacebook, FaTwitter } from 'react-icons/fa';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface SocialShareProps {
  registrationNumber: string;
  userName: string;
}

export default function SocialShare({ registrationNumber, userName }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  const shareMessage = `🎉 I just registered for Divine Worship Splash 2026!

Join me on Saturday, January 31st at Casely-Hayford Hall, UCC Campus for a day of worship with Yefter Nkansah.

It's FREE! Register now: ${shareUrl}

#DivineWorshipSplash2026 #InvitationToLight`;

  const whatsappMessage = encodeURIComponent(shareMessage);
  const twitterMessage = encodeURIComponent(
    `🎉 I just registered for Divine Worship Splash 2026! Join me on Jan 31st at UCC Campus. It's FREE! ${shareUrl} #DivineWorshipSplash2026`
  );
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    toast.success('Message copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const socialButtons = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'from-green-500 to-green-600',
      href: `https://wa.me/?text=${whatsappMessage}`,
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: 'from-blue-600 to-blue-700',
      href: facebookUrl,
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      color: 'from-sky-500 to-sky-600',
      href: `https://twitter.com/intent/tweet?text=${twitterMessage}`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 text-foreground mb-3">
        <Share2 className="w-5 h-5" />
        <h3 className="font-semibold text-lg">Invite Your Friends</h3>
      </div>

      <p className="text-center text-muted-foreground text-sm">
        Share the good news and bring your friends along!
      </p>

      <div className="grid grid-cols-3 gap-3">
        {socialButtons.map((button, index) => {
          const Icon = button.icon;
          return (
            <motion.a
              key={button.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={button.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-gradient-to-r ${button.color} text-white px-4 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-2`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{button.name}</span>
            </motion.a>
          );
        })}
      </div>

      {/* Copy Link Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={copyToClipboard}
        className="w-full bg-muted hover:bg-muted/80 text-foreground px-4 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5 text-green-600" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-5 h-5" />
            <span>Copy Invitation Message</span>
          </>
        )}
      </motion.button>
    </div>
  );
}