export const useQueryParams = () => {
    if ('URLSearchParams' in window) {
        const urlParams = new URLSearchParams(window.location.search);
        const res = {};
        [...urlParams.entries()].map(([key, value]) => {
            res[key] = value;
        });
        return res;
    }
    return {};
};
