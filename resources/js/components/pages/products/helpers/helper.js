exports.modifyCategories = (categories, label = null, nested = false, children = false) => {
  for (let index in categories) {
    let el = categories[index]
    el.value = el.id
    el.parentschain = getParentsChain(categories[index], categories)
    el.ancestors = categories.filter((e) => e.parent_id === categories[index].parent_id)
    el[children? "children" : "firstlevelchildren"] = categories.filter((e) => e.parent_id === categories[index].id)
    let path = el.parentschain.map((e) => e.name).join(el.parentschain.length > 1 ? " > " : "")
    el.label = label ? label(path, null) : el.name
  }
  return nested ? categories.filter(e => e.parent_id === null) : categories 
}


const getParentsChain = (category, categories) => {
  let el = [category]
  let parent = categories.find((e) => e.id === category.parent_id)
  return parent ? getParentsChain(parent, categories).concat(el) : el
}

exports.getLastElement = (obj = []) => {
  return obj[obj.length - 1]
}