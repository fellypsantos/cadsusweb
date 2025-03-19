export const showStack = (stack: string[]): void => {
  $('#stack-diag').dialog({ width: 450, height: 250 });
  $('#tbl-stack-diag tbody').html('');

  stack.forEach((cns) => {
    $('#tbl-stack-diag tbody').append(`
    <tr>
      <th scope="col">${cns}</th>
      <th scope="col" class="text-center">
      <a href="#!" onClick="javascript:deleteFromStack('${cns}')" class="btn-sm btn-danger">Excluir</a>
      </th>
    </tr>`);
  });
};

(window as any).showStack = showStack;
