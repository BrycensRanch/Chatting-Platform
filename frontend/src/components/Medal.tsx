import { useRouter } from 'next/router';
import { useState } from 'react';

type IMedalProps = {
  initialValue?: boolean;
  title?: string;
  body?: string;
};

export default function Modal(props: IMedalProps) {
  const router = useRouter();

  const [showModal, setShowModal] = useState<boolean>(
    props.initialValue === undefined ? true : props.initialValue
  );
  return (
    <>
      {props.initialValue === false ? (
        <button
          className="mr-1 mb-1 rounded bg-pink-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-pink-600"
          type="button"
          onClick={() => setShowModal(true)}
          data-testid="medal-button1"
        >
          Open regular modal
        </button>
      ) : null}
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative my-6 mx-auto w-auto max-w-3xl">
              {/* content */}
              <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/* header */}
                <div className="flex items-start justify-between rounded-t border-b border-solid border-slate-200 p-5">
                  <h3
                    className="text-3xl font-semibold"
                    id="medal-title"
                    data-testid="medal-title"
                    aria-label="medal-title"
                    role="heading"
                  >
                    {props.title}
                  </h3>
                  <button
                    className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                    data-testid="medal-button2"
                  >
                    <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/* body */}
                <div className="relative flex-auto p-6">
                  <p
                    className="my-4 text-lg leading-relaxed text-slate-500"
                    id="medal-body"
                    data-testid="medal-body"
                    aria-label="medal-body"
                    role="dialog"
                  >
                    {props.body}
                  </p>
                </div>
                {/* footer */}
                <div className="flex items-center justify-end rounded-b border-t border-solid border-slate-200 p-6">
                  <button
                    className="mr-1 mb-1 rounded bg-red-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                    type="button"
                    data-testid="medal-button3"
                    onClick={() => {
                      function delQuery(asPath: string) {
                        return asPath.split('?')[0];
                      }
                      setShowModal(false);
                      router.push(`${delQuery(router.asPath)}`);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
    </>
  );
}
