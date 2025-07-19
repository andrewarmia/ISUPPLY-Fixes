import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';

export default function Edit({post}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {post.title}
                </h2>
            }
        >
            <Head title={`Post ${post.title}`}/>

            <p className="py-6 px-4 text-gray-900 dark:text-gray-100"
               dangerouslySetInnerHTML={{__html: post.content}}/>

        </AuthenticatedLayout>
    );
}
