import { NewspaperIcon } from '@/components/icons';
import { categories } from '@/components/navbar';
import ServerNewsArticle from '@/components/server-news-article';
import PageLink from '@/components/page-link';
import { notFound } from 'next/navigation';

type NewsProps = {
  params: { category: string };
  searchParams: { page: number };
};

export function generateMetadata({ params }: NewsProps) {
  const category = params.category;
  const modified = category[0].toUpperCase() + category.slice(1);

  return {
    title: 'Google News' + ' - ' + modified,
  };
}

export default async function NewsByCategory({
  params,
  searchParams,
}: NewsProps) {
  const category = params.category;
  const pageParams = searchParams.page;
  const modified = category[0].toUpperCase() + category.slice(1);

  const res = await fetch('http://localhost:3000/api/newsByCategory');

  const newsByCategoryData: NewsData = await res.json();
  console.log(newsByCategoryData);
  const newsByCategoryList = newsByCategoryData.value;
  const newCategories = categories.slice(1);

  if (!newCategories?.includes(category) || pageParams > 5) {
    notFound();
  }

  return (
    <main className='py-10 space-y-5'>
      <div className='flex items-center gap-x-2'>
        <NewspaperIcon className='w-8 h-8' />
        <h1 className='text-3xl font-medium'>{modified}</h1>
      </div>

      <div className='bg-white p-5 rounded-md flex flex-col md:flex-row md:gap-x-4 shadow-md h-full'>
        <div className='flex flex-col gap-y-4 md:w-1/2'>
          {newsByCategoryList.slice(0, 6).map((news) => (
            <ServerNewsArticle
              key={news.url}
              {...news}
              className='article-by-category'
            />
          ))}
        </div>

        <div className='bg-neutral-200 h-[1.5px] md:h-auto md:w-[2px] mb-4 md:mb-0'></div>

        <div className='flex flex-col gap-y-4 md:w-1/2'>
          {newsByCategoryList.slice(6, 12).map((news) => (
            <ServerNewsArticle
              key={news.url}
              {...news}
              className='article-by-category'
            />
          ))}
        </div>
      </div>

      <div className='space-x-10 text-center'>
        <PageLink href={'?page=1'}>1</PageLink>
        <PageLink href={'?page=2'}>2</PageLink>
        <PageLink href={'?page=3'}>3</PageLink>
        <PageLink href={'?page=4'}>4</PageLink>
        <PageLink href={'?page=5'}>5</PageLink>
      </div>
    </main>
  );
}
