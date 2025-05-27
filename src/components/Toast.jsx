export default function Toast({ message }) {
  return (
    <div className="bg-black text-white px-4 py-2 rounded shadow-md text-sm">
      {message}
    </div>
  );
}
