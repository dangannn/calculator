<?php
$expression = $_POST['data'];
$expression = str_replace(' ', '+', $expression);
function calculate($statement)
{
    $calcQueue = array();
    $calcStack = array();
    $operStack = array();
    $operPriority = array(
        '(' => 0,
        ')' => 0,
        '+' => 1,
        '-' => 1,
        '*' => 2,
        '/' => 2,
    );
    $token = '';
    foreach (str_split($statement) as $char) {
        if ($char >= '0' && $char <= '9' || $char === '.') {
            $token .= $char;
        } else {
            if (strlen($token)) {
                array_push($calcQueue, $token);
                $token = '';
            }
            if (isset($operPriority[$char])) {
                if (')' == $char) {
                    while (!empty($operStack)) {
                        $oper = array_pop($operStack);
                        if ('(' == $oper) {
                            break;
                        }
                        array_push($calcQueue, $oper);
                    }
                    if ('(' != $oper) {
                        return 'Unexpected ")"';
                    }
                } else {
                    while (!empty($operStack) && '(' != $char) {
                        $oper = array_pop($operStack);
                        if ($operPriority[$char] > $operPriority[$oper]) {
                            array_push($operStack, $oper);
                            break;
                        }
                        if ('(' != $oper) {
                            array_push($calcQueue, $oper);
                        }
                    }
                    array_push($operStack, $char);
                }
            } elseif (strpos(' ', $char) !== FALSE) {
            } else {
                return 'Unexpected symbol "' . $char . '"';
            }
        }

    }
    if (strlen($token)) {
        array_push($calcQueue, $token);
        $token = '';
    }
    if (!empty($operStack)) {
        while ($oper = array_pop($operStack)) {
            if ('(' == $oper) {
                return 'Unexpected "("';
            }
            array_push($calcQueue, $oper);
        }
    }


    foreach ($calcQueue as $token) {
        switch ($token) {
            case '+':
                $arg2 = array_pop($calcStack);
                $arg1 = array_pop($calcStack);
                array_push($calcStack, ($arg1 + $arg2));
                break;
            case '-':
                $arg2 = array_pop($calcStack);
                $arg1 = array_pop($calcStack);
                array_push($calcStack, $arg1 - $arg2);
                break;
            case '*':
                $arg2 = array_pop($calcStack);
                $arg1 = array_pop($calcStack);
                array_push($calcStack, $arg1 * $arg2);
                break;
            case '/':
                $arg2 = array_pop($calcStack);
                $arg1 = array_pop($calcStack);
                array_push($calcStack, $arg1 / $arg2);
                break;
            default:
                array_push($calcStack, $token);
        }
    }
    return array_pop($calcStack);
}

echo calculate($expression);
?>
