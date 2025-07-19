import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea.jsx';
import {Transition} from '@headlessui/react';
import {useForm} from '@inertiajs/react';
import ImageUpload from "@/Components/ImageUpload.jsx";

export default function UpdatePostForm({post, className = '',}) {

    const {data, setData, post: postRequest, errors, processing, recentlySuccessful} =
        useForm({
            title: post.title,
            content: post.content,
            image: null,
            _method: 'patch', // Important: Inertia uses this for PUT/PATCH requests
        });

    const onSubmit = async (e) => {
        e.preventDefault();
        // When submitting a form that includes files, you must set forceFormData to true.
        // This ensures Inertia sends the data as multipart/form-data.
        postRequest(route('posts.update', post.id));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Update Post
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update your post's title, content, and attachment.
                </p>
            </header>

            <form onSubmit={onSubmit} className="mt-6 space-y-6" encType="multipart/form-data">
                <div>
                    <InputLabel htmlFor="title" value="Title"/>

                    <TextInput
                        id="title"
                        className="mt-1 block w-full"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        required
                        isFocused
                        autoComplete="title"
                    />

                    <InputError className="mt-2" message={errors.title}/>
                </div>

                <div>
                    <InputLabel htmlFor="content" value="Content"/>

                    <TextArea
                        id="content"
                        className="mt-1 block w-full"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        required
                        autoComplete="content"
                        rows={10}
                        cols={40}
                    />

                    <InputError className="mt-2" message={errors.content}/>
                </div>
                <div>
                    <InputLabel htmlFor="attachment" value="Attachment"/>

                    <ImageUpload
                        name="image" // The name of the file input
                        value={data.attachment_path} // The current File object from your form data
                        onChange={(file) => setData('image', file)} // Callback to update form data with the File object
                        error={errors.attachment_path} // Display validation errors for the image
                    />

                    <InputError className="mt-2" message={errors.attachment_path}/>
                </div>


                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
