import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowLeft, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { BLOG_ARTICLES } from '../data/blogData';
import SEO from '../components/SEO';

const BlogDetailPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const article = BLOG_ARTICLES.find(a => a.slug === slug);

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!article) {
        return (
            <div className="min-h-screen bg-white pt-28 pb-20">
                <SEO title="Makale Bulunamadı" />
                <div className="container mx-auto px-4 text-center">
                    <div className="text-6xl mb-6">📝</div>
                    <h1 className="text-3xl font-black text-secondary mb-4">Makale Bulunamadı</h1>
                    <p className="text-gray-500 mb-8">Aradığınız blog yazısı mevcut değil.</p>
                    <Link to="/blog" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all">
                        Blog'a Dön
                    </Link>
                </div>
            </div>
        );
    }

    const relatedArticles = BLOG_ARTICLES.filter(a => a.slug !== slug && a.category === article.category).slice(0, 3);

    // Markdown benzeri içeriği HTML'e çevirme (basit versiyon)
    const formatContent = (content: string) => {
        return content
            .split('\n\n')
            .map((paragraph, idx) => {
                if (paragraph.startsWith('## ')) {
                    return <h2 key={idx} className="text-2xl font-black text-secondary mt-10 mb-4">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                    return <h3 key={idx} className="text-xl font-bold text-secondary mt-8 mb-3">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('* ')) {
                    const items = paragraph.split('\n').filter(l => l.startsWith('* '));
                    return (
                        <ul key={idx} className="list-disc list-inside space-y-2 text-gray-600 my-4 pl-4 marker:text-primary">
                            {items.map((item, i) => <li key={i}>{item.replace('* ', '')}</li>)}
                        </ul>
                    );
                }
                if (paragraph.startsWith('1. ')) {
                    const items = paragraph.split('\n').filter(l => /^\d+\.\s/.test(l));
                    return (
                        <ol key={idx} className="list-decimal list-inside space-y-3 text-gray-600 my-4 pl-4 marker:text-primary marker:font-bold">
                            {items.map((item, i) => <li key={i} className="pl-2">{item.replace(/^\d+\.\s/, '')}</li>)}
                        </ol>
                    );
                }
                if (paragraph.startsWith('**')) {
                    return <p key={idx} className="font-bold text-secondary my-4 text-lg border-l-4 border-primary pl-4 bg-orange-50 py-2 rounded-r-lg">{paragraph.replace(/\*\*/g, '')}</p>;
                }
                return <p key={idx} className="text-gray-600 leading-relaxed my-4 text-lg">{paragraph}</p>;
            });
    };

    return (
        <div className="min-h-screen bg-white pt-[240px] md:pt-[360px] pb-20">
            <SEO
                title={article.title}
                description={article.excerpt}
                image={article.image}
                type="article"
            />

            {/* Hero/Header */}
            <section className="container mx-auto px-4 mb-12">
                <Link to="/blog" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:gap-3 transition-all group">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    Blog'a Dön
                </Link>

                <div className="max-w-4xl">
                    <span className="inline-block bg-primary text-white text-xs font-bold px-4 py-2 rounded-full mb-6 shadow-sm shadow-primary/30">
                        {article.category}
                    </span>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-secondary leading-tight mb-8">
                        {article.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-100 pb-8">
                        <span className="flex items-center gap-2">
                            <User size={18} className="text-primary" />
                            <span className="font-bold text-gray-700">{article.author}</span>
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar size={18} className="text-primary" /> {article.date}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock size={18} className="text-primary" /> {article.readTime} okuma
                        </span>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            <section className="container mx-auto px-4 mb-16">
                <div className="max-w-5xl mx-auto">
                    <div className="aspect-[21/9] rounded-[2rem] overflow-hidden bg-gray-100 shadow-xl shadow-gray-200/50">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="container mx-auto px-4 mb-20">
                <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
                    {/* Main Content */}
                    <div className="lg:w-2/3">
                        <div className="prose prose-lg prose-orange max-w-none">
                            <p className="lead text-xl text-gray-600 font-medium mb-8 leading-relaxed border-l-4 border-gray-200 pl-6 italic">
                                {article.excerpt}
                            </p>
                            {formatContent(article.content)}
                        </div>

                        {/* Tags & Share */}
                        <div className="border-t border-gray-100 mt-16 pt-10">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="flex flex-wrap items-center gap-3">
                                    <Tag size={18} className="text-gray-400" />
                                    {article.tags.map(tag => (
                                        <span key={tag} className="bg-gray-100 text-gray-600 text-sm font-bold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-default">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500 font-bold uppercase tracking-wider">Paylaş</span>
                                    <div className="flex gap-2">
                                        <button className="w-10 h-10 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all transform hover:scale-110">
                                            <Facebook size={18} />
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white transition-all transform hover:scale-110">
                                            <Twitter size={18} />
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all transform hover:scale-110">
                                            <Linkedin size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-32 space-y-8">
                            {/* Author Box */}
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-white p-1 border border-gray-200 shadow-sm">
                                        <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                            <User size={32} />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs uppercase font-black text-primary tracking-wider">Yazar Hakkında</span>
                                        <h4 className="font-bold text-secondary text-lg">{article.author}</h4>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Evcil hayvan dostu uzmanımız, sağlıklı ve mutlu patiler için deneyimlerini paylaşıyor.
                                </p>
                            </div>

                            {/* Related Articles Widget */}
                            <div>
                                <h3 className="font-black text-secondary text-lg mb-4 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                                    İlginizi Çekebilir
                                </h3>
                                <div className="space-y-4">
                                    {relatedArticles.map(related => (
                                        <Link
                                            key={related.id}
                                            to={`/blog/${related.slug}`}
                                            className="flex gap-4 group bg-white p-3 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                                        >
                                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={related.image}
                                                    alt={related.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <span className="text-[10px] font-bold text-primary mb-1">{related.category}</span>
                                                <h4 className="text-sm font-bold text-secondary leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                                    {related.title}
                                                </h4>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogDetailPage;
