export default function ServerLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#8b5a2b] mb-6"></div>
      <p className="text-lg text-[#8b5a2b] font-semibold animate-pulse">
        Waking up the server, please wait...
      </p>
    </div>
  );
}
