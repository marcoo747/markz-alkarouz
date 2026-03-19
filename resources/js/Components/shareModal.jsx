import { useEffect, useMemo, useState } from "react";

import shareIcon from "../../imgs/share.png";
import whatsappIcon from "../../imgs/whatsapp.svg";
import facebookIcon from "../../imgs/facebook.svg";
import twitterXIcon from "../../imgs/twitter-x.svg";
import telegramIcon from "../../imgs/telegram.svg";

export default function ShareModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const shareLinks = useMemo(() => {
    const encodedUrl = encodeURIComponent(currentUrl);

    return {
      whatsapp: `https://wa.me/?text=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}`,
    };
  }, [currentUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
      {/* Share Button */}
      <img
        src={shareIcon}
        alt="share"
        onClick={() => setIsOpen(true)}
        className="h-[30px] w-[30px] cursor-pointer transition duration-200 hover:scale-105 hover:brightness-110"
      />

      {/* Modal */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-[5px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[400px] rounded-xl bg-[#181818] p-[30px] text-center text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-[15px] top-[15px] text-2xl text-gray-400 transition hover:text-white"
            >
              &times;
            </button>

            <h2 className="mb-5 text-[20px] font-bold">Share this page</h2>

            {/* Icons */}
            <div className="mb-5 flex justify-around gap-3">
              <a
                href={shareLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center text-[12px] text-white transition hover:scale-110 hover:text-[#7e56f1]"
              >
                <img
                  src={whatsappIcon}
                  alt="WhatsApp"
                  className="mb-2.5 w-10 invert"
                />
                WhatsApp
              </a>

              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center text-[12px] text-white transition hover:scale-110 hover:text-[#7e56f1]"
              >
                <img
                  src={facebookIcon}
                  alt="Facebook"
                  className="mb-2.5 w-10 invert"
                />
                Facebook
              </a>

              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center text-[12px] text-white transition hover:scale-110 hover:text-[#7e56f1]"
              >
                <img
                  src={twitterXIcon}
                  alt="Twitter"
                  className="mb-2.5 w-10 invert"
                />
                Twitter
              </a>

              <a
                href={shareLinks.telegram}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center text-[12px] text-white transition hover:scale-110 hover:text-[#7e56f1]"
              >
                <img
                  src={telegramIcon}
                  alt="Telegram"
                  className="mb-2.5 w-10 invert"
                />
                Telegram
              </a>
            </div>

            {/* Copy URL */}
            <div className="flex items-center justify-between rounded-lg bg-[#2c2c2c] px-[10px] py-[6px]">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-transparent text-sm text-white outline-none"
              />
              <button
                onClick={handleCopy}
                className="rounded-md bg-[#7e56f1] px-3 py-1.5 font-bold text-white transition hover:bg-[#a28bfa]"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
