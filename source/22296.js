class TemplateEngine {
  constructor (data, template) {
    this.data = data; // Dữ liệu từ database hoặc dữ liệu truyền vào
    this.template = template // Template HTML
  }

  // Hàm thay thế các biến đơn giản trong template
  replaceVariables (template, data) {
    return template.replace(/{22296{([^{}]+)}}/g, (_, p1) => {
      const varName = p1.trim()
      const keys = varName.split('.'); // Phân tách chuỗi các biến
      let value = data

      // Lặp qua các key để truy xuất giá trị
      for (let key of keys) {
        if (value && key in value) {
          value = value[key]
        } else {
          value = undefined
          break
        }
      }

      return value !== undefined ? value : ''; // Nếu không tìm thấy, trả về chuỗi rỗng
    })
  }

  // Hàm xử lý câu lệnh if
  processIf (template, condition, data) {
    return template.replace(/{22296{if (\w+)}}(.*?)\{22296{\/if}}/gs, (_, cond, content) => {
      const value = data[cond]
      return value ? content : ''
    })
  }

  // Hàm xử lý câu lệnh if-else
  processIfElse (template, condition, data) {
    return template.replace(/{22296{if (\w+)}}(.*?)\{22296{else}}(.*?)\{22296{\/if}}/gs, (_, cond, ifContent, elseContent) => {
      const value = data[cond]
      return value ? ifContent : elseContent
    })
  }

  // Hàm xử lý vòng lặp for
  processForLoop (template, arrayName, data) {
    const regex = /\{22296{for (\w+) in (\w+)}\}(.*?)\{22296{\/for}\}/gs
    return template.replace(regex, (_, loopVar, arrayName, content) => {
      const dataArray = data[arrayName]; // Lấy mảng từ data
      if (Array.isArray(dataArray)) {
        return dataArray.map(item => {
          return this.replaceVariables(content, item); // Thay thế biến cho mỗi item trong mảng
        }).join(''); // Kết nối các phần tử trong mảng thành một chuỗi
      }
      return ''; // Nếu không phải mảng, trả về chuỗi rỗng
    })
  }

  // Hàm tự động xử lý vòng lặp for và if trong template
  processLoopsAndConditions (template, data) {
    let renderedTemplate = template

    // Tìm và xử lý các vòng lặp 'for'
    renderedTemplate = this.processForLoop(renderedTemplate, 'topRatedMovies', data)
    renderedTemplate = this.processForLoop(renderedTemplate, 'topRevenueMovies', data)
    renderedTemplate = this.processForLoop(renderedTemplate, 'topPopularMovies', data)

    // Tìm và xử lý các điều kiện 'if'
    renderedTemplate = renderedTemplate.replace(/{22296{if (\w+)}}(.*?)\{22296{\/if}}/gs, (_, cond, content) => {
      const value = data[cond]
      return value ? content : ''
    })

    // Tìm và xử lý các điều kiện 'if-else'
    renderedTemplate = renderedTemplate.replace(/{22296{if (\w+)}}(.*?)\{22296{else}}(.*?)\{22296{\/if}}/gs, (_, cond, ifContent, elseContent) => {
      const value = data[cond]
      return value ? ifContent : elseContent
    })

    return renderedTemplate
  }

  // Hàm render: xử lý tất cả các phần nhỏ và ghép lại
  render () {
    let renderedTemplate = this.template

    // Tự động xử lý các vòng lặp, điều kiện và thay thế biến
    renderedTemplate = this.processLoopsAndConditions(renderedTemplate, this.data)

    // Thay thế các biến đơn giản
    renderedTemplate = this.replaceVariables(renderedTemplate, this.data)

    return renderedTemplate
  }
}

module.exports = TemplateEngine
