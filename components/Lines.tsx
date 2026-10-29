/** Quebra um título em linhas mascaradas para a animação [data-lines]. */
export function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((l, i) => (
        <span className="line" key={i}>
          <span>{l}</span>
          {i < lines.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}
