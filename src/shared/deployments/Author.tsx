interface Props {
  author?: string;
}

export default function Author({ author }: Props) {
  if (!author) {
    return <></>;
  }

  return <>by {author.split("<")[0].trim()}</>;
}
