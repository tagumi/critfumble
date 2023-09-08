'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import DropDown, { ActionType } from '../components/DropDown';
import Footer from '../components/Footer';
import Github from '../components/GitHub';
import Header from '../components/Header';
import { useChat } from 'ai/react';

export default function Page() {
  const [flav, setFlav] = useState('');
  const [action, setAction] = useState<ActionType>('Melee Attack');
  const flavRef = useRef<null | HTMLDivElement>(null);

  const scrollToFlavs = () => {
    if (flavRef.current !== null) {
      flavRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { input, handleInputChange, handleSubmit, isLoading, messages } =
    useChat({
      body: {
        action,
        flav,
      },
      onResponse() {
        scrollToFlavs();
      },
    });

  const onSubmit = (e: any) => {
    setFlav(input);
    handleSubmit(e);
  };

  const lastMessage = messages[messages.length - 1];
  const generatedFlavs = lastMessage?.role === "assistant" ? lastMessage.content : null;

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/tagumi/critfumble"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>View on Github</p>
        </a>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate your next Critical Fumble using chatGPT
        </h1>
        <p className="text-slate-500 mt-5">Based on Vercel Template TwitterBio https://github.com/Nutlope/twitterbio</p>
        <form className="max-w-xl w-full" onSubmit={onSubmit}>
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Tell me exactly what you were trying to do!{' '}
              <span className="text-slate-500">
                (not currently implemented)
              </span>
              .
            </p>
          </div>
          <textarea
            value={input}
            onChange={handleInputChange}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              'e.g. Durdle the Harengon attempts to stab the gnoll with a long pointed rapier'
            }
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Select your action.</p>
          </div>
          <div className="block">
            <DropDown action={action} setAction={(newAction) => setAction(newAction)} />
          </div>

          {!isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              type="submit"
            >
              Generate your fumble &rarr;
            </button>
          )}
          {isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <span className="loading">
                <span style={{ backgroundColor: 'white' }} />
                <span style={{ backgroundColor: 'white' }} />
                <span style={{ backgroundColor: 'white' }} />
              </span>
            </button>
          )}
        </form>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <output className="space-y-10 my-10">
          {generatedFlavs && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={flavRef}
                >
                  Your generated fumble
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedFlavs
                  .substring(generatedFlavs.indexOf('1') + 3)
                  .split('2.')
                  .map((generatedFlav) => {
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedFlav);
                          toast('Fumble copied to clipboard', {
                            icon: '✂️',
                          });
                        }}
                        key={generatedFlav}
                      >
                        <p>{generatedFlav}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </output>
      </main>
      <Footer />
    </div>
  );
}
