export default function ViewMoreBtn({ currentPage, commentsTotalPages, setCurrentPage}) {
  const viewHandle = () => {
    currentPage < commentsTotalPages && setCurrentPage(currentPage + 1);
  };
  return (
    <div>
      <button onClick={viewHandle}>view more</button>
    </div>
  );
}
