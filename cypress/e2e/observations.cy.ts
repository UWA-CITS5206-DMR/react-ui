// cypress/e2e/observations.cy.ts

describe('Observation Feature E2E Tests', () => {

  beforeEach(() => {
    // beforeEach 会在每个 it() 测试用例运行前执行
    // 这确保了每个测试都有一个干净、统一的起点

    // 1. 访问应用首页
    cy.visit('http://localhost:5173/');

    // 登录操作
    // 【注意】: 这里的选择器是占位符，需要你用实际的替换
    cy.get('#username').type('sg1');
    cy.get('#password').type('studentgroup-1');
    cy.get('[type="submit"]').click();
  }); // <-- 看这里！beforeEach 在这里正确地结束了

  it('OBS-001: 应该允许用户成功添加一条新的生命体征记录', () => {
    // ==== Arrange (准备) ====
    // 点击病人列表中的 "Toni Baxter" 进入详情页
    // cy.contains() 是一个非常有用的命令，它会查找包含特定文本的元素
    cy.contains('Toni Baxter').click();

    // 点击 "Observations" 标签页
    cy.contains('Observations').click();


    // ==== Act (行动) ====
    // 点击 "+ Add Observations" 按钮，打开添加表单
    // 注意：这里我们假设按钮上的文本就是这些，如果不是，需要修改
    cy.contains('Add Observations').click();

    // 填写表单。你需要找到这些输入框对应的“选择器” (selector)
    // 最佳实践是使用 data-testid 属性，但也可以用 id, class, name 等
    // 【你的任务】: 你需要用浏览器的“检查”功能找到正确的选择器来替换下面的占位符

    cy.get('#bp-systolic').type('125');
    cy.get('#bp-diastolic').type('85');
    cy.get('#bp-systolic').parents('.grid').find('button').click();

    cy.get('#heartRate').type('75');
    cy.get('#heartRate').parents('.grid').find('button').click();

    cy.get('#temperature').type('36.8');
    cy.get('#temperature').parents('.grid').find('button').click();

    cy.get('#respiratoryRate').type('18');
    cy.get('#respiratoryRate').parents('.grid').find('button').click();

    cy.get('#oxygenSaturation').type('98');
    cy.get('#oxygenSaturation').parents('.grid').find('button').click();

    cy.get('#bloodSugar').type('5.6');
    cy.get('#bloodSugar').parents('.grid').find('button').click();

    cy.get('#painScore').type('6');
    cy.get('#painScore').parents('.grid').find('button').click();

  });

});