type LayoutProps = {
    children: React.ReactNode;
    title: string;
  };

  
  export default function ContentForm({children,title}: LayoutProps) {
    return (
        <div className="space-y-10 divide-y divide-gray-900/10 animate-fadein">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7">{title}</h2>
          </div>
  
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 my-2">
            <div className="px-4 py-6 sm:p-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }