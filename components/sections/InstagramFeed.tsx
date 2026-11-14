"use client";

import { Instagram, Heart, MessageCircle } from "lucide-react";

const instaPosts = [
  { image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&q=80", likes: 124, comments: 8 },
  { image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&q=80", likes: 89, comments: 5 },
  { image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", likes: 156, comments: 12 },
  { image: "https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?w=400&q=80", likes: 203, comments: 15 },
  { image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=400&q=80", likes: 97, comments: 6 },
  { image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80", likes: 178, comments: 10 },
];

export function InstagramFeed() {
  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <Instagram className="w-5 h-5 text-gold" />
            <span className="font-body text-sm text-gold font-medium">@zame_fashion</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal mb-3">
            Follow Us on Instagram
          </h2>
          <p className="font-body text-warm-gray max-w-md mx-auto">
            Discover our latest looks, collections and inspirations. Tag us to be featured.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          {instaPosts.map((post, i) => (
            <a
              key={i}
              href="https://instagram.com/zame_fashion"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-image overflow-hidden bg-white"
            >
              <img
                src={post.image}
                alt={`Instagram post ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-charcoal/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <div className="flex items-center gap-1 text-white">
                  <Heart className="w-4 h-4 fill-current" />
                  <span className="font-body text-sm font-medium">{post.likes}</span>
                </div>
                <div className="flex items-center gap-1 text-white">
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span className="font-body text-sm font-medium">{post.comments}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="https://instagram.com/zame_fashion"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-6 py-3 rounded-pill font-body text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Instagram className="w-4 h-4" /> Follow @zame_fashion
          </a>
        </div>
      </div>
    </section>
  );
}
