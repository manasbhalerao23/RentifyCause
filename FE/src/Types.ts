export interface BlogData{
    map(arg0: (e: any, index: any) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
    images: string[],
    heading: string,
    body:string,
    location: string,
    dateTime: Date,
    _id: string
}