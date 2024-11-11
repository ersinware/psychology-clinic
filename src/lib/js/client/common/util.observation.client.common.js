export function addIntersectionObserver(node, onIntersect, threshold) {
    const observer = new IntersectionObserver(
        entries => onVisibleOrInvisible(entries, onIntersect),
        { threshold: threshold ?? 0 }
    )
    observer.observe(node)

    return observer
}

export function removeIntersectionObserver(observer) {
    if (observer)
        observer.disconnect()
}

function onVisibleOrInvisible(entries, onIntersect) {
    for (const entry of entries)
        if (entry.isIntersecting) {
            onIntersect()

            return
        }
}