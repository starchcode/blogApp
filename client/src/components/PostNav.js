export default function ({postTotalPages, currentPage, setCurrentPage}) {
const prevButtonActive = currentPage !== 1 ? true : false;

const nextHandle = () => {
    currentPage < postTotalPages && setCurrentPage(currentPage + 1)
}
const prevHandle = () => {
    currentPage <= postTotalPages && currentPage > 1 && setCurrentPage(currentPage - 1)

}
    return (
        <div className="postNav">
            <button onClick={() => prevHandle()} className={prevButtonActive ? "activeButton": ""}>Previous</button>
                <p>page {currentPage} of {postTotalPages}</p>
            <button onClick={() => nextHandle()}>Next</button>
        </div>
    )
}