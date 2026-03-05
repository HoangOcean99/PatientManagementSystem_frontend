export const filterBySearchAndStatus = ({
    data = [],
    search = "",
    filter = "Tất cả",
    searchFields = [],
    statusField = "is_active"
}) => {
    if (!data) return data
    return data.filter((item) => {

        if (filter === "Hoạt động" && !item[statusField]) return false;
        if (filter === "Dừng hoạt động" && item[statusField]) return false;

        if (search && search.trim() !== "") {
            const keyword = search.toLowerCase();

            return searchFields.some((field) =>
                item[field]?.toLowerCase().includes(keyword)
            );
        }

        return true;
    });
};