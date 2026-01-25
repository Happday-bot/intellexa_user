import { newsItems } from "@/app/data/newsData";
import NewsDetailsClient from "@/app/components/news/NewsDetailsClient";

export async function generateStaticParams() {
    return newsItems.map((news) => ({
        id: news.id.toString(),
    }));
}

export default async function NewsDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const newsId = Number(id);
    const initialNews = newsItems.find(n => n.id === newsId);

    return <NewsDetailsClient newsId={newsId} initialNews={initialNews} />;
}
