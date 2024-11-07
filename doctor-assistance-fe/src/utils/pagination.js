export const getPaginationItems = (currentPage, totalPages) => {
    const pages = [];
    const range = 1;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages) {
            pages.push(i);
        } else {
            if (i === 2 && currentPage - range > 2 || i === totalPages - 1 && currentPage + range < totalPages - 1) {
                pages.push('...');
            }
            if (i >= Math.max(2, currentPage - range) && i <= Math.min(totalPages - 1, currentPage + range)) {
                pages.push(i);
            }
        }
    }
    return pages;
};
