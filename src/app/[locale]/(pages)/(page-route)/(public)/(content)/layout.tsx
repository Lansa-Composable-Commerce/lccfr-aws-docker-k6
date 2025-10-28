export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={"flex flex-col min-h-[60vh]"}>
      <section className="flex-1 container mx-auto pt-14 pb-4 w-full flex flex-col">
        {children}
      </section>
    </div>
  );
}
