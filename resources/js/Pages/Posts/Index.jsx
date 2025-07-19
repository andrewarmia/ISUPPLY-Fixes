import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, usePage} from '@inertiajs/react';
import PostsTable from "@/Components/Posts/Table.jsx";
import Select2Search from "@/Components/Select2Search.jsx";
import React, { useState, useEffect } from 'react'; // Import useState and useEffect

export default function Index({posts, isAdmin}) {
    const user = usePage().props.auth.user;

    // Use useState to manage the author_id filter
    const [authorFilterId, setAuthorFilterId] = useState(null);

    const filteredPosts = posts.filter(post => {
        if (authorFilterId) {
            return post.author_id === authorFilterId;
        }
        return true; // If no filter is set, return all posts
    });

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Posts
                </h2>
            }
        >
            <Head title={`Posts`}/>
            <div className="py-12 mt-4">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 p-5">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800 p-3">

                        <Link
                            href={route('posts.create')}
                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Create New Post
                        </Link>

                        {/* Pass a function to onItemSelected that updates the state */}
                        <div className="mt-4 w-64"> {/* Added a div for basic spacing/width for Select2Search */}
                        <Select2Search
                            apiUrl={route('api.users.search')}
                            onItemSelected={(item) => {
                                    // Update the authorFilterId state with the selected item's ID
                                    setAuthorFilterId(item.id);
                            }}
                                placeholder="Filter by author..."
                        />
                            {authorFilterId && (
                                <button
                                    onClick={() => setAuthorFilterId(null)}
                                    className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                                >
                                    Clear Filter
                                </button>
                            )}
                        </div>


                        <h3 className="text-lg font-medium text-gray-900 mt-6 mb-4">Your Posts</h3>

                        {filteredPosts.length > 0 ? (
                            <PostsTable posts={filteredPosts} isAdmin={isAdmin}/> // Use the new component
                        ) : (
                            <p className="text-gray-600">No posts found with current filters.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
