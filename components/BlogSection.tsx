import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Calendar, User } from 'lucide-react';
import FadeInSection from './FadeInSection';

const BLOG_POSTS = [
    {
        id: 1,
        title: 'Köpeğinizin Beslenme Rutini Nasıl Olmalı?',
        excerpt: 'Sadık dostunuzun sağlıklı ve uzun bir ömür sürmesi için doğru beslenme ipuçları ve dikkat edilmesi gerekenler.',
        image: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=2070&auto=format&fit=crop',
        date: '12 Ocak 2024',
        author: 'Vet. Dr. Ahmet Yılmaz',
        category: 'Köpek Bakımı',
        slug: 'kopek-beslenme-rutini'
    },
    {
        id: 2,
        title: 'Kedilerde Tüy Bakımı ve Taranma Alışkanlığı',
        excerpt: 'Kedinizin tüylerinin parlak ve sağlıklı kalması için uygulamanız gereken günlük bakım rutinleri.',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2066&auto=format&fit=crop',
        date: '08 Ocak 2024',
        author: 'Pati Uzmanı',
        category: 'Kedi Bakımı',
        slug: 'kedi-tuy-bakimi'
    },
    {
        id: 3,
        title: 'Evcil Hayvanlar İçin Kış Bakım Önerileri',
        excerpt: 'Soğuk havalarda minik dostlarınızı korumak ve onların konforunu sağlamak için yapmanız gerekenler.',
        image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop',
        date: '05 Ocak 2024',
        author: 'Editoryal Ekip',
        category: 'Genel Sağlık',
        slug: 'kis-bakim-onerileri'
    }
];

const BlogSection: React.FC = () => {
    return (
        <section className="w-full py-24 bg-white border-t border-gray-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="text-brand font-black text-xs uppercase tracking-[0.3em] bg-brand/5 px-4 py-2 rounded-full inline-block mb-4">
                        Faydalı Bilgiler
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-secondary tracking-tight mb-4">
                        Pati Rehberi 🐾
                    </h2>
                    <p className="text-gray-500 font-medium max-w-2xl mx-auto">
                        Evcil dostlarınızın sağlığı, bakımı ve mutluluğu için uzman veteriner hekimlerimizden öneriler ve ipuçları.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                    {BLOG_POSTS.map((post, idx) => (
                        <FadeInSection key={post.id} delay={idx * 100}>
                            <Link to={`/blog/${post.slug}`} className="group block h-full">
                                <article className="flex flex-col h-full bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:border-brand/20 hover:shadow-xl hover:shadow-brand/5 transition-all duration-300">
                                    {/* Image */}
                                    <div className="h-64 overflow-hidden relative">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-brand shadow-sm">
                                            {post.category}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-4">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} /> {post.date}
                                            </span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                            <span className="flex items-center gap-1.5">
                                                <User size={14} /> {post.author}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-black text-secondary leading-tight mb-4 group-hover:text-brand transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>

                                        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto flex items-center gap-2 text-xs font-black text-brand uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                            Devamını Oku <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </FadeInSection>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-16">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-3 bg-secondary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-brand transition-colors shadow-xl hover:shadow-brand/30"
                    >
                        <BookOpen size={20} />
                        Tüm Yazıları İncele
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
