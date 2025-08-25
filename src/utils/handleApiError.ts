export function handleApiError(error: any, router: any) {
  if (typeof window !== 'undefined') {
    const requestId = window && window?.sessionStorage.getItem('requestId');
    // const code = window && window?.sessionStorage.getItem('code');
    // if (requestId && code) {
    //   router.replace(`/home/${requestId}&code=${code}`);
    // } else {
    //   router.replace('/home');
    // }
    if (requestId) {
      router.replace(`/home/${requestId}`);
    } else {
      router.replace('/home');
    }
  }
} 

