export const POST_COMPLETED_EVENT = 'post-completed';

export const API_ORIGIN = 'https://localhost:7244';

export const DEFAULT_POST_IMAGE =
  'https://images.unsplash.com/photo-1559027615-cd99713b8bb7?w=800&q=80';

export const isPostComplete = (post) =>
  post?.isComplete === true || post?.IsComplete === true;

export const getLockDate = (post) => post?.lockDate ?? post?.LockDate ?? null;

export const isPostLocked = (post) => {
  if (getLockDate(post)) return true;
  return post?.isLocked === true || post?.IsLocked === true;
};

/** قراءة مسار الصورة من أي صيغة يرجعها الـ API */
export const getRawImagePath = (post) => {
  if (!post) return '';
  const value =
    post.imagePath ??
    post.ImagePath ??
    post.imagepath ??
    post.Imagepath ??
    '';
  return typeof value === 'string' ? value.trim() : '';
};

/** تحويل المسار إلى URL قابل للعرض في المتصفح */
export const resolveImageUrl = (path) => {
  if (!path) return '';

  if (path.startsWith('data:') || path.startsWith('blob:')) return path;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('//')) return `https:${path}`;
  if (/^www\./i.test(path)) return `https://${path}`;

  // مسار نسبي من السيرver (مثل uploads/photo.jpg)
  return path.startsWith('/')
    ? `${API_ORIGIN}${path}`
    : `${API_ORIGIN}/${path}`;
};

export const getImagePreviewUrl = (path) => {
  if (!path) return '';
  return resolveImageUrl(path);
};

/** قراءة صورة من الجهاز وضغطها قبل الحفظ في imagePath */
export const fileToCompressedDataUrl = (
  file,
  { maxWidth = 1200, maxHeight = 1200, quality = 0.82, maxBytes = 800000 } = {}
) =>
  new Promise((resolve, reject) => {
    if (!file?.type?.startsWith('image/')) {
      reject(new Error('يرجى اختيار ملف صورة صالح (JPG, PNG, …)'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const scale = Math.min(1, maxWidth / width, maxHeight / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        let currentQuality = quality;
        let dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
        while (dataUrl.length > maxBytes * 1.37 && currentQuality > 0.4) {
          currentQuality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
        }

        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('تعذّر قراءة الصورة'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('تعذّر قراءة الملف'));
    reader.readAsDataURL(file);
  });

export const getPostImage = (post) => {
  const raw = getRawImagePath(post);
  if (!raw) return DEFAULT_POST_IMAGE;
  return resolveImageUrl(raw);
};

export const normalizePost = (post) => {
  const imagePath = getRawImagePath(post);
  return {
    ...post,
    imagePath,
    isComplete: isPostComplete(post),
    lockDate: getLockDate(post),
    isLocked: isPostLocked(post),
  };
};

export const dispatchPostCompleted = (postID) => {
  window.dispatchEvent(
    new CustomEvent(POST_COMPLETED_EVENT, { detail: { postID } })
  );
};
