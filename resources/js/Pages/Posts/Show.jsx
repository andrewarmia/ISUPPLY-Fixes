import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Show({ auth, post }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Post Details</h2>}
        >
            <Head title="Post Details" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                            <p className="py-6 px-4 text-gray-900 dark:text-gray-100">
                                {post.content} {/* Security: removed dangerouslySetInnerHTML */}
                            </p>
                            {post.attachment_path && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Attachment:</p>
                                    <a 
                                        href={`/storage/${post.attachment_path}`} 
                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        View Attachment
                                    </a>
                                </div>
                            )}
                            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                <p>Author: {post.author?.name}</p>
                                <p>Created: {new Date(post.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}