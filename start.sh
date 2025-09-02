#!/bin/bash

# React UI 项目启动脚本
# 支持开发、构建、预览等多种模式

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 项目信息
PROJECT_NAME="React UI"
VERSION="2.0.0"

# 默认配置
DEFAULT_API_URL="http://localhost:8000/api/v1"
DEFAULT_PORT="5173"

# 显示帮助信息
show_help() {
    echo -e "${BLUE}${PROJECT_NAME} v${VERSION} 启动脚本${NC}"
    echo ""
    echo -e "${CYAN}用法:${NC}"
    echo "  $0 [选项] [命令]"
    echo ""
    echo -e "${CYAN}命令:${NC}"
    echo "  dev, d       启动开发服务器"
    echo "  build, b     构建生产版本"
    echo "  preview, p   预览构建结果"
    echo "  install, i   安装依赖"
    echo "  clean, c     清理构建文件"
    echo "  check, t     运行类型检查"
    echo "  db:init      初始化数据库"
    echo "  db:studio    打开数据库管理界面"
    echo "  status, s    显示项目状态"
    echo "  help, h      显示此帮助信息"
    echo ""
    echo -e "${CYAN}选项:${NC}"
    echo "  --api-url URL     设置API基础URL (默认: ${DEFAULT_API_URL})"
    echo "  --port PORT       设置开发服务器端口 (默认: ${DEFAULT_PORT})"
    echo "  --host HOST       设置开发服务器主机 (默认: localhost)"
    echo "  --open            自动打开浏览器"
    echo "  --https           使用HTTPS"
    echo "  --verbose         显示详细信息"
    echo "  --production      生产模式构建"
    echo "  --api-logging LEVEL   设置API日志级别 (true|false|detailed)"
    echo "  --mock            启用Mock API模式"
    echo "  --mock-delay MIN-MAX  设置Mock延迟范围 (毫秒)"
    echo "  --mock-error-rate RATE 设置Mock错误率 (0.0-1.0)"
    echo ""
    echo -e "${CYAN}环境变量:${NC}"
    echo "  VITE_API_BASE_URL  API基础URL"
    echo "  VITE_API_LOGGING   API日志级别 (true|false|detailed)"
    echo "  VITE_MOCK_API      Mock API模式 (true|false)"
    echo "  VITE_MOCK_DELAY_MIN Mock最小延迟 (毫秒)"
    echo "  VITE_MOCK_DELAY_MAX Mock最大延迟 (毫秒)"
    echo "  VITE_MOCK_ERROR_RATE Mock错误率 (0.0-1.0, 默认0)"
    echo "  PORT               开发服务器端口"
    echo "  HOST               开发服务器主机"
    echo ""
    echo -e "${CYAN}示例:${NC}"
    echo "  $0 dev                                    # 启动开发服务器"
    echo "  $0 dev --api-url http://api.example.com   # 指定API地址"
    echo "  $0 dev --port 3000 --open                # 指定端口并打开浏览器"
    echo "  $0 build --production                     # 生产构建"
    echo "  $0 preview --port 4173                    # 预览构建结果"
    echo "  $0 dev --mock                             # 启用Mock模式开发"
    echo "  $0 dev --mock --mock-delay 200-1000       # Mock模式自定义延迟"
}

# 显示项目状态
show_status() {
    echo -e "${BLUE}=== ${PROJECT_NAME} 项目状态 ===${NC}"
    echo ""
    
    # 检查Node.js版本
    if command -v node >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Node.js: $(node --version)"
    else
        echo -e "${RED}✗${NC} Node.js: 未安装"
    fi
    
    # 检查npm版本
    if command -v npm >/dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} npm: $(npm --version)"
    else
        echo -e "${RED}✗${NC} npm: 未安装"
    fi
    
    # 检查package.json
    if [ -f "package.json" ]; then
        echo -e "${GREEN}✓${NC} package.json: 存在"
        local pkg_version=$(grep '"version"' package.json | head -1 | sed 's/.*"version": *"\([^"]*\)".*/\1/')
        echo -e "${CYAN}  项目版本:${NC} ${pkg_version}"
    else
        echo -e "${RED}✗${NC} package.json: 不存在"
    fi
    
    # 检查node_modules
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✓${NC} node_modules: 已安装"
    else
        echo -e "${YELLOW}!${NC} node_modules: 未安装 (运行 $0 install)"
    fi
    
    # 检查构建文件
    if [ -d "dist" ]; then
        echo -e "${GREEN}✓${NC} dist: 构建文件存在"
    else
        echo -e "${YELLOW}!${NC} dist: 未构建 (运行 $0 build)"
    fi
    
    # 检查环境变量
    echo -e "${CYAN}环境配置:${NC}"
    echo -e "  API_URL: ${VITE_API_BASE_URL:-${DEFAULT_API_URL}}"
    echo -e "  PORT: ${PORT:-${DEFAULT_PORT}}"
    echo -e "  NODE_ENV: ${NODE_ENV:-development}"
    
    echo ""
}

# 检查依赖
check_dependencies() {
    if ! command -v node >/dev/null 2>&1; then
        echo -e "${RED}错误: Node.js 未安装${NC}"
        echo "请访问 https://nodejs.org/ 安装 Node.js"
        exit 1
    fi
    
    if ! command -v npm >/dev/null 2>&1; then
        echo -e "${RED}错误: npm 未安装${NC}"
        exit 1
    fi
    
    if [ ! -f "package.json" ]; then
        echo -e "${RED}错误: package.json 不存在${NC}"
        echo "请确保在项目根目录运行此脚本"
        exit 1
    fi
}

# 检查node_modules
check_node_modules() {
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}未找到 node_modules，正在安装依赖...${NC}"
        npm install
    fi
}

# 设置环境变量
setup_env() {
    # 设置API URL
    if [ -n "$API_URL" ]; then
        export VITE_API_BASE_URL="$API_URL"
    elif [ -z "$VITE_API_BASE_URL" ]; then
        export VITE_API_BASE_URL="$DEFAULT_API_URL"
    fi
    
    # 设置端口
    if [ -n "$SERVER_PORT" ]; then
        export PORT="$SERVER_PORT"
    elif [ -z "$PORT" ]; then
        export PORT="$DEFAULT_PORT"
    fi
    
    # 设置主机
    if [ -n "$SERVER_HOST" ]; then
        export HOST="$SERVER_HOST"
    fi
    
    # 设置API日志级别
    if [ -n "$API_LOGGING" ]; then
        export VITE_API_LOGGING="$API_LOGGING"
    elif [ -z "$VITE_API_LOGGING" ]; then
        export VITE_API_LOGGING="true"  # 默认启用日志
    fi
    
    # 设置Mock模式
    if [ "$MOCK_MODE" = "true" ]; then
        export VITE_MOCK_API="true"
    fi
    
    # 设置Mock延迟
    if [ -n "$MOCK_DELAY" ]; then
        IFS='-' read -r min_delay max_delay <<< "$MOCK_DELAY"
        export VITE_MOCK_DELAY_MIN="$min_delay"
        export VITE_MOCK_DELAY_MAX="$max_delay"
    fi
    
    # 设置Mock错误率
    if [ -n "$MOCK_ERROR_RATE" ]; then
        export VITE_MOCK_ERROR_RATE="$MOCK_ERROR_RATE"
    fi
    
    if [ "$VERBOSE" = "true" ]; then
        echo -e "${CYAN}环境变量:${NC}"
        echo "  VITE_API_BASE_URL=$VITE_API_BASE_URL"
        echo "  VITE_API_LOGGING=$VITE_API_LOGGING"
        [ -n "$VITE_MOCK_API" ] && echo "  VITE_MOCK_API=$VITE_MOCK_API"
        [ -n "$VITE_MOCK_DELAY_MIN" ] && echo "  VITE_MOCK_DELAY_MIN=$VITE_MOCK_DELAY_MIN"
        [ -n "$VITE_MOCK_DELAY_MAX" ] && echo "  VITE_MOCK_DELAY_MAX=$VITE_MOCK_DELAY_MAX"
        [ -n "$VITE_MOCK_ERROR_RATE" ] && echo "  VITE_MOCK_ERROR_RATE=$VITE_MOCK_ERROR_RATE"
        echo "  PORT=$PORT"
        [ -n "$HOST" ] && echo "  HOST=$HOST"
        echo ""
    fi
}

# 启动开发服务器
start_dev() {
    echo -e "${GREEN}启动开发服务器...${NC}"
    
    if [ "$VITE_MOCK_API" = "true" ]; then
        echo -e "${PURPLE}🎭 Mock模式已启用${NC}"
        [ -n "$VITE_MOCK_DELAY_MIN" ] && echo -e "${CYAN}Mock延迟:${NC} ${VITE_MOCK_DELAY_MIN}-${VITE_MOCK_DELAY_MAX}ms"
        [ -n "$VITE_MOCK_ERROR_RATE" ] && echo -e "${CYAN}Mock错误率:${NC} ${VITE_MOCK_ERROR_RATE}"
    else
        echo -e "${CYAN}API地址:${NC} $VITE_API_BASE_URL"
    fi
    
    echo -e "${CYAN}访问地址:${NC} http://${HOST:-localhost}:${PORT}"
    echo ""
    
    # 构建vite命令参数
    local vite_args=""
    [ -n "$SERVER_PORT" ] && vite_args="$vite_args --port $SERVER_PORT"
    [ -n "$SERVER_HOST" ] && vite_args="$vite_args --host $SERVER_HOST"
    [ "$OPEN_BROWSER" = "true" ] && vite_args="$vite_args --open"
    [ "$USE_HTTPS" = "true" ] && vite_args="$vite_args --https"
    
    npm run dev -- $vite_args
}

# 构建项目
build_project() {
    echo -e "${GREEN}构建项目...${NC}"
    
    if [ "$PRODUCTION" = "true" ]; then
        export NODE_ENV=production
        echo -e "${CYAN}构建模式:${NC} 生产环境"
    else
        echo -e "${CYAN}构建模式:${NC} 默认"
    fi
    
    echo -e "${CYAN}API地址:${NC} $VITE_API_BASE_URL"
    
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ 构建完成${NC}"
        echo -e "${CYAN}输出目录:${NC} dist/"
    else
        echo -e "${RED}✗ 构建失败${NC}"
        exit 1
    fi
}

# 预览构建结果
preview_build() {
    if [ ! -d "dist" ]; then
        echo -e "${YELLOW}未找到构建文件，正在构建...${NC}"
        build_project
    fi
    
    echo -e "${GREEN}预览构建结果...${NC}"
    
    local preview_args=""
    [ -n "$SERVER_PORT" ] && preview_args="$preview_args --port $SERVER_PORT"
    [ -n "$SERVER_HOST" ] && preview_args="$preview_args --host $SERVER_HOST"
    [ "$OPEN_BROWSER" = "true" ] && preview_args="$preview_args --open"
    
    npm run preview -- $preview_args
}

# 安装依赖
install_deps() {
    echo -e "${GREEN}安装依赖...${NC}"
    npm install
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ 依赖安装完成${NC}"
    else
        echo -e "${RED}✗ 依赖安装失败${NC}"
        exit 1
    fi
}

# 清理构建文件
clean_build() {
    echo -e "${GREEN}清理构建文件...${NC}"
    
    if [ -d "dist" ]; then
        rm -rf dist/
        echo -e "${GREEN}✓ 已删除 dist/目录${NC}"
    else
        echo -e "${YELLOW}! dist/目录不存在${NC}"
    fi
    
    if [ -d "node_modules/.vite" ]; then
        rm -rf node_modules/.vite/
        echo -e "${GREEN}✓ 已删除 Vite 缓存${NC}"
    fi
}

# 类型检查
type_check() {
    echo -e "${GREEN}运行类型检查...${NC}"
    
    if command -v tsc >/dev/null 2>&1; then
        npm run check
    else
        echo -e "${YELLOW}! TypeScript 编译器未找到，跳过类型检查${NC}"
    fi
}

# 数据库初始化
db_init() {
    echo -e "${GREEN}初始化数据库...${NC}"
    npm run db:init
}

# 数据库管理界面
db_studio() {
    echo -e "${GREEN}打开数据库管理界面...${NC}"
    npm run db:studio
}

# 解析命令行参数
COMMAND=""
API_URL=""
SERVER_PORT=""
SERVER_HOST=""
OPEN_BROWSER="false"
USE_HTTPS="false"
VERBOSE="false"
PRODUCTION="false"
API_LOGGING=""
MOCK_MODE="false"
MOCK_DELAY=""
MOCK_ERROR_RATE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        dev|d)
            COMMAND="dev"
            shift
            ;;
        build|b)
            COMMAND="build"
            shift
            ;;
        preview|p)
            COMMAND="preview"
            shift
            ;;
        install|i)
            COMMAND="install"
            shift
            ;;
        clean|c)
            COMMAND="clean"
            shift
            ;;
        check|t)
            COMMAND="check"
            shift
            ;;
        db:init)
            COMMAND="db:init"
            shift
            ;;
        db:studio)
            COMMAND="db:studio"
            shift
            ;;
        status|s)
            COMMAND="status"
            shift
            ;;
        help|h)
            COMMAND="help"
            shift
            ;;
        --api-url)
            API_URL="$2"
            shift 2
            ;;
        --port)
            SERVER_PORT="$2"
            shift 2
            ;;
        --host)
            SERVER_HOST="$2"
            shift 2
            ;;
        --open)
            OPEN_BROWSER="true"
            shift
            ;;
        --https)
            USE_HTTPS="true"
            shift
            ;;
        --verbose)
            VERBOSE="true"
            shift
            ;;
        --production)
            PRODUCTION="true"
            shift
            ;;
        --api-logging)
            API_LOGGING="$2"
            shift 2
            ;;
        --mock)
            MOCK_MODE="true"
            shift
            ;;
        --mock-delay)
            MOCK_DELAY="$2"
            shift 2
            ;;
        --mock-error-rate)
            MOCK_ERROR_RATE="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}未知参数: $1${NC}"
            echo "使用 '$0 help' 查看帮助"
            exit 1
            ;;
    esac
done

# 如果没有指定命令，显示帮助
if [ -z "$COMMAND" ]; then
    COMMAND="help"
fi

# 显示标题
if [ "$COMMAND" != "help" ] && [ "$COMMAND" != "status" ]; then
    echo -e "${PURPLE}=== ${PROJECT_NAME} v${VERSION} ===${NC}"
    echo ""
fi

# 执行命令
case $COMMAND in
    help)
        show_help
        ;;
    status)
        show_status
        ;;
    dev)
        check_dependencies
        check_node_modules
        setup_env
        start_dev
        ;;
    build)
        check_dependencies
        check_node_modules
        setup_env
        build_project
        ;;
    preview)
        check_dependencies
        check_node_modules
        setup_env
        preview_build
        ;;
    install)
        check_dependencies
        install_deps
        ;;
    clean)
        clean_build
        ;;
    check)
        check_dependencies
        check_node_modules
        type_check
        ;;
    db:init)
        check_dependencies
        check_node_modules
        db_init
        ;;
    db:studio)
        check_dependencies
        check_node_modules
        db_studio
        ;;
    *)
        echo -e "${RED}未知命令: $COMMAND${NC}"
        echo "使用 '$0 help' 查看帮助"
        exit 1
        ;;
esac
