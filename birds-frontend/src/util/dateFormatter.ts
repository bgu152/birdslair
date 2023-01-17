
export default function dateFormatter(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return ('0'  + hours).slice(-2)+':'+ ('0'  + minutes).slice(-2)+':'+('0' + seconds).slice(-2);
}