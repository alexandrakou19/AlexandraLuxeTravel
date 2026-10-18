/**
 * View transition names. A destination's cover photo carries one name across card and hero, so
 * tapping a card grows that photo into the hero. Without a partner on the other page, the photo
 * leaves and arrives with the rest of the page (enter/exit "page-in" / "page-out").
 */
export const destinationPhotoName = (slug: string) => `destination-photo-${slug}`
