module.exports = function (list) {
  const { entryPart, outputPart } = list.reduce((pre, next) => {
    const entry = `import ${next.name} from "@views/${next.name}"`
    const output = `{path: "${next.route}",component: ${next.name}, }`

    return {
      entryPart: pre.entryPart.concat(entry),
      outputPart: pre.outputPart.concat(output)
    }
  }, { entryPart: [], outputPart: [] })

  const entryString = entryPart.join('\n')
  const outputString = outputPart.join()

  return `
  ${entryString}

    type IRoute = {
      path: string;
      component: ((props: any) => JSX.Element) | React.FC<any>;
    }[];

    /**
     * 路由配置
     */
    const routes: IRoute = [
      ${outputString}
    ];
    export default routes;
  `
}
