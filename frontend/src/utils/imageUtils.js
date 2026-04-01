export const categoryImages = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
  fashion: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
  homekitchen: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
  beauty: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400',
  books: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
  sports: 'https://c4.wallpaperflare.com/wallpaper/971/967/737/sports-images-for-desktop-background-wallpaper-preview.jpg'
};

export const getValidImageUrl = (originalUrl, name = '') => {
  const searchName = name ? name.toLowerCase() : '';
  
  if (originalUrl && !originalUrl.includes('placeholder.com') && !originalUrl.includes('via.placeholder')) {
    return originalUrl;
  }
  
  if (searchName.includes('electronic')) return categoryImages.electronics;
  if (searchName.includes('fashion') || searchName.includes('clothing')) return categoryImages.fashion;
  if (searchName.includes('home') || searchName.includes('kitchen')) return categoryImages.homekitchen;
  if (searchName.includes('beauty')) return categoryImages.beauty;
  if (searchName.includes('book')) return categoryImages.books;
  if (searchName.includes('sport')) return categoryImages.sports;
  
  return 'https://images.unsplash.com/photo-1513116476489-7635e79feb27?w=400';
};
